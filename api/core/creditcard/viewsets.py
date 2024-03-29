from rest_framework import status, viewsets
from rest_framework.response import Response

from core.creditcard.models import CreditCard
from core.creditcard.serializers import CreditCardSerializer

class CreateCreditCard(viewsets.ModelViewSet):
    http_method_names = ['post']
    serializer_class = CreditCardSerializer
    queryset = CreditCard.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Save the new credit card to the database
            credit_card = serializer.save()
            
            # Use the serializer to represent the response (this will keep the format consistent)
            return_data = CreditCardSerializer(credit_card).data
            return_data.update({'status': 'success', 'message': 'Credit card created successfully.'})
            
            return Response(return_data, status=status.HTTP_201_CREATED)

        # If the data is not valid, return an error response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)