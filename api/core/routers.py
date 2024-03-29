from rest_framework import routers

from core.transfer.viewsets import TransferViewset
from core.checkcc.viewsets import CreditCardCheckViewset
from core.creditcard.viewsets import CreateCreditCard

router = routers.SimpleRouter()

router.register(r'transfer', TransferViewset, basename='transfer')
router.register(r'check', CreditCardCheckViewset, basename='check')
router.register(r'create', CreateCreditCard, basename='create')

urlpatterns = [
    *router.urls,
]