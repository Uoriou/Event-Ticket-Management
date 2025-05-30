from django.db import models
import datetime
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here. MVT
class Organizer(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(max_length = 254)
    is_organizer = models.BooleanField(default=True)

class Event(models.Model):
    
   name = models.CharField(max_length=100)
   organizer = models.CharField(max_length=100,default="Mario")
   image = models.ImageField(upload_to='images/',null=True, blank=True)
   description = models.TextField(default="No description provided")
   date = models.DateTimeField(auto_now_add=True, blank=True) 
   venue = models.CharField(max_length=100)
   availability =  models.BooleanField()
   price = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
   participants = models.IntegerField(default=0)
    
class Ticket(models.Model):
    
    description = models.CharField(max_length=100) 
    event = models.ForeignKey("Event",on_delete=models.CASCADE)
    
class Sale(models.Model):
    
    event = models.ForeignKey("Event",on_delete=models.CASCADE)
    organizer = models.CharField(max_length=100,default="admin")
    sales = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    quantity = models.IntegerField()
    
class Attendee(models.Model):
    #They have to extend Django user as well and in views.py we can check if its attendee or org
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(max_length = 254)
    is_attendee = models.BooleanField(default=True)
    #Make sure an attendee can have many events
    event = models.ManyToManyField("Event",related_name="attendees")
    
   
class Feedback(models.Model):
    event_associated = models.ForeignKey("Event",on_delete=models.CASCADE)
    feedback_from = models.ForeignKey("Attendee",on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    