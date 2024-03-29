# core/transfer/serializers.py
from rest_framework import serializers

class CCCheckSerializer(serializers.Serializer):
    cardNumber = serializers.CharField(max_length=16)  # Sender's card
    cvv = serializers.CharField(max_length=3)
    expirationDate = serializers.CharField(max_length=5)
    cardHolderName = serializers.CharField(max_length=100)

    def validate(self, data):
        """
        Check the card details are valid.
        """
        # Add validation logic here and raise a serializers.ValidationError if necessary
        return data