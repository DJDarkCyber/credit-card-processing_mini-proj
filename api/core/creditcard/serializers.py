from rest_framework import serializers
from core.creditcard.models import CreditCard

class CreditCardSerializer(serializers.ModelSerializer):
    
    cardHolderName = serializers.CharField(source='cardholder_name', max_length=100)
    cardNumber = serializers.CharField(source='card_number', max_length=16)
    expirationDate = serializers.CharField(source='expiration_date', max_length=5)
    cvv = serializers.CharField(max_length=3)
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        model = CreditCard
        fields = ['cardHolderName', 'cardNumber', 'expirationDate', 'cvv', 'balance']