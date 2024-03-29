from rest_framework import status, viewsets
from rest_framework.response import Response
from django.db import transaction

from core.creditcard.models import CreditCard
from core.transfer.serializers import TransferSerializer

class TransferViewset(viewsets.ModelViewSet):
    http_method_names = ['post']
    serializer_class = TransferSerializer
    queryset = CreditCard.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            sender_card_number = serializer.validated_data.get('cardNumber')
            sender_cvv = serializer.validated_data.get('cvv')
            sender_expiration_date = serializer.validated_data.get('expirationDate')
            sender_name = serializer.validated_data.get('cardHolderName')
            amount_to_transfer = serializer.validated_data.get('amount')
            recipient_card_number = serializer.validated_data.get('recipientCardNumber')

            sender_card = CreditCard.objects.filter(card_number=sender_card_number).first()
            recipient_card = CreditCard.objects.filter(card_number=recipient_card_number).first()

            # Now perform all the necessary checks
            if not sender_card:
                return Response({'status': 'error', 'message': 'Sender card not found.'}, status=status.HTTP_400_BAD_REQUEST)

            if not recipient_card:
                return Response({'status': 'error', 'message': 'Recipient card not found.'}, status=status.HTTP_400_BAD_REQUEST)

            if sender_card.cvv != sender_cvv or sender_card.expiration_date != sender_expiration_date or sender_card.cardholder_name != sender_name:
                return Response({'status': 'error', 'message': 'Sender card details incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

            if sender_card.balance < amount_to_transfer:
                return Response({'status': 'error', 'message': 'Insufficient balance.'}, status=status.HTTP_400_BAD_REQUEST)

            # Using transaction.atomic to make sure both changes are saved only if both are correct
            with transaction.atomic():
                sender_card.balance -= amount_to_transfer
                recipient_card.balance += amount_to_transfer
                
                sender_card.save()
                recipient_card.save()

            return Response({
                'status': 'success',
                'message': 'Transfer completed successfully.',
                'cardNumber': sender_card.card_number,
                'recipientCardNumber': recipient_card.card_number,
                'amount': amount_to_transfer
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)