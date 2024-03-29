from rest_framework import status, viewsets
from rest_framework.response import Response

from core.creditcard.models import CreditCard
from core.checkcc.serializers import CCCheckSerializer

class CreditCardCheckViewset(viewsets.ModelViewSet):
    http_method_names = ['post']
    serializer_class = CCCheckSerializer
    queryset = CreditCard.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            card_number = serializer.validated_data.get('cardNumber')
            cvv = serializer.validated_data.get('cvv')
            expiration_date = serializer.validated_data.get('expirationDate')
            cardholder_name = serializer.validated_data.get('cardHolderName')

            card = CreditCard.objects.filter(card_number=card_number, cvv=cvv, expiration_date=expiration_date, cardholder_name=cardholder_name).first()

            if card:
                # Return limited and non-sensitive data.
                return Response({
                    'status': 'success',
                    'cardHolderName': card.cardholder_name,
                    # Consider masking the credit card number.
                    'cardNumber': f'**** **** **** {card.card_number[-4:]}',
                    'expirationDate': card.expiration_date,
                    'balance': card.balance
                })
            else:
                return Response({'status': 'error', 'message': 'Credit card details are incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)