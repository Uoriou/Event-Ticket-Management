from django.shortcuts import render
from .models import Event,Organizer,Attendee,Ticket,Feedback,Sale
from .serializers import EventSerializer,OrganizersSerializer,AttendeesSerializer,TicketSerializer,FeedbackSerializer,UserSerializer,SalesSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
# Create your views here.


"""
User management 
"""

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    #When the user is created, i need to do access control
    #and assign the user to the correct group, organizer or attendee


@api_view(['GET'])
@permission_classes([AllowAny]) # Change it to IsAuthenticated later
def current_user(request,username):
    
    users = User.objects.filter(username=username)
    if not users.exists():
        return JsonResponse({"error": "User not found"}, status=404)
    serialized_item = UserSerializer(users, many=True).data
    return JsonResponse(serialized_item, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def user_info(request):
    #If authenticated, it will return the user info with associated events
    if IsAuthenticated:
        print("Authenticated")

        users = User.objects.filter(username=request.user.username)
            
        if not users.exists():
            return JsonResponse({"error": "User not found"}, status=404)
        serialized_item = UserSerializer(users, many=True).data
        return JsonResponse(serialized_item, safe=False)
    else:
        print("Not authenticated")
        return JsonResponse({"error": "User not authenticated"}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_user_id(request):
    #If authenticated, it will return the user info with associated events
    print(request.user.id) # This requires auth
    users = User.objects.filter(username=request.user.username)
    return JsonResponse({"message":request.user.id})
   


#This function will be used to handle access control
#need to check if the user is an attendee or organizer
#and then assign the user to the correct Class based on Models.py
@api_view(['POST'])
@permission_classes([AllowAny])
def handle_access_control(request):
    print(request.method)
    print("OI")
    if request.method == 'POST':
        
        access = request.data.get('access') 
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        print("Username:", username)
        print("Email:", email)
        print("Access Control:", access)
        
        try:
            if access == "Attendee":
                user = User.objects.create_user(username=username, password=password, email=email)
                attendee = Attendee.objects.create(
                    user=user, 
                    email=email,
                    is_attendee=True
                )
                print("Attendee created:", attendee)
            elif access == "Event Organizer": 
                #Something wrong with username
                user = User.objects.create_user(username=username, password=password, email=email)
                organizer = Organizer.objects.create(
                    user=user,
                    email=email,
                    is_organizer=True
                )
                print("Organizer created:", organizer)
            
            else:
                return JsonResponse({"error": "Invalid access control value"}, status=400)
                
        except Exception as e:
            print("Error:", e)
            return JsonResponse({"error": "Failed to create user"}, status=500)
       
        return JsonResponse({"message": "Access control handled successfully"}, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_access_info(request):
    #Get if the user is an attendee or organizer
    #and return the user info
    try: 
        if is_user_attendee := Attendee.objects.filter(user=request.user):
            print("Attendee:", is_user_attendee)
            serialized_item = AttendeesSerializer(is_user_attendee, many=True).data
            return JsonResponse(serialized_item, safe=False)
        if is_user_organizer := Organizer.objects.filter(user=request.user):
            print("Organizer:", is_user_organizer)
            serialized_item = OrganizersSerializer(is_user_organizer, many=True).data
            return JsonResponse(serialized_item, safe=False)
        if not is_user_attendee and not is_user_organizer:
            return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        print("Error:", e)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event(request):
    
    try: 
        if attendee := Attendee.objects.filter(user=request.user):
            #print(is_user_attendee)
            for i in attendee:
                event = i.event.all()
                serialized_event = EventSerializer(event, many=True).data
                return JsonResponse(serialized_event, safe=False)
        
        #Fix this later 
        elif organizer := Organizer.objects.filter(user=request.user):
        
            for i in organizer:
                event = Event.objects.filter(organizer=i.user.username)
                for i in event:
                    print(i.name)
                    
                    serialized_event = EventSerializer(event, many=True).data
                    return JsonResponse(serialized_event, safe=False)
    except Exception as e:
        print("Error:", e)
    return JsonResponse({"error": "User not found..."}, status=404)
     

@api_view(['POST'])
@permission_classes([AllowAny])
def update_attendee_event(request):
    
    if request.method == 'POST':
        data = request.POST
        print("Received data:", data)
       
        try:
            if event := Event.objects.get(id=data["eventId"]):
                attendee = Attendee.objects.get(user=request.user)
                attendee.event.add(event)
                print(attendee.event.all())
                serializer = EventSerializer(instance = event,data=data,partial=True)
                print(event.id)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data, safe=False)
                else:
                    print("Error:", serializer.errors)
                    return JsonResponse(serializer.errors, safe=False)
        except Event.DoesNotExist:
            return JsonResponse({"error": "Event not found"}, status=404)
        
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)

"""
CRUD operations for events with some custom functions to help with the process
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    
    data = request.data
    print("Received data:", data)
    print(data["name"]) # valid
    serializer = EventSerializer(data=data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, safe=False)
    else:
        print("Error:", serializer.errors)
        return JsonResponse(serializer.errors, safe=False)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_events(request): #Any kind of event
    
    try:
        event = Event.objects.all()
        serialized_item = EventSerializer(event, many=True).data
        return JsonResponse(serialized_item, safe=False)
    except Exception:
        return JsonResponse({'error': 'Event not found'}, status=404)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_event_clicked(request, event_id):
    
    try:
        event = Event.objects.get(id=event_id)
        serialized_item = EventSerializer(event).data
        return JsonResponse(serialized_item, safe=False)
    except Event.DoesNotExist:
        return JsonResponse({'error': 'Event not found'}, status=404)

@api_view(['POST']) 
@permission_classes([IsAuthenticated])
def update_event(request, id):
    item = Event.objects.get(id=id) # Ok this might be wrong
    data = request.data
    print("Received data:", data) 
    serialized_item = EventSerializer(instance=item, data=data, partial=True)
    #update only the current price
    if serialized_item.is_valid():
        serialized_item.save()
        return JsonResponse(serialized_item.data, safe=False)
    else:
        print("Error:", serialized_item.errors)
        return JsonResponse(serialized_item.errors, safe=False)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_event(request, event_id):
    item = Event.objects.get(id=event_id)
    item.delete()
    return JsonResponse({"message": "Event deleted successfully"}, status=204)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_ticket(request):
    data = request.data
    print("Received data:", data)
    serializer = TicketSerializer(data=data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, safe=False)
    else:
        print("Error:", serializer.errors)
        return JsonResponse(serializer.errors, safe=False)
    
    
"""
Sales 
"""
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_sales(request):
    if IsAuthenticated:
        print("Authenticated OK")
    event_id = 0
    event= Event.objects.filter(organizer=request.user)
    for i in event:
        print("ID is")
        print(i.id)
        event_id = i.id
    data = request.data
    print("Received data sales:", data) 
    sale = Sale.objects.filter(event_id = data["eventId"]) #eventid is a foreignkey 
    """#Here i need to do a sales calculation 
    for i in sale:
        print("Sales ID is")
        print(i.id)
        print(i.event_id)
        i.sales = 5 * 5
        i.quantity = data["participants"]
        #i.save()
   
    serialized_item = SalesSerializer(instance=sale, data=data, partial=True)
    #update only the current price
    if serialized_item.is_valid():
        serialized_item.save()
        return JsonResponse(serialized_item.data, safe=False)
    else:
        print("Error:", serialized_item.errors)
        return JsonResponse(serialized_item.errors, safe=False)
    """
    # Get all sales for the given event ID
    sales = Sale.objects.filter(event_id=data["eventId"])

    updated_sales = []
    for sale in sales:
       #calculate sales 
        sale.sales = float(data["price"]) * int(data["participants"])
        sale.quantity = int(data["participants"])
        sale.save()

        serializer = SalesSerializer(sale)
        updated_sales.append(serializer.data)

    return JsonResponse(updated_sales, safe=False)


@api_view(['GET'])
@permission_classes([AllowAny])

def get_participants(request):
    data = request.data
    print("Received data:", data)
    print("HELLO")
    serializer = AttendeesSerializer(data=data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, safe=False)
    else:
        print("Error:", serializer.errors)
        return JsonResponse(serializer.errors, safe=False)