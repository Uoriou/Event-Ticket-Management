from .models import Event,Organizer,Attendee,Ticket,Feedback,Sale
from rest_framework import serializers
from django.contrib.auth.models import User


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'  
class OrganizersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizer
        fields = '__all__'  
        
class AttendeesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendee
        fields = '__all__'  
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'  
            
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'  
       
class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'      
class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ['username', 'email', 'password']
            extra_kwargs = {
                'password': {'write_only': True}
            }
            
