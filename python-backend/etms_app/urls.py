from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    
    #Event management
    path('api/', include(router.urls)),
    path('events/', views.get_events,name="events"),
    path("event_clicked/<int:event_id>", views.get_event_clicked,name="event_clicked"),
    path('add/', views.create_event,name="create"),
    path("update/<int:event_id>", views.update_event,name="update"),
    path("delete/<int:event_id>", views.delete_event,name="delete"),
        
    #User management, Authentication
    path('users/', views.user_info,name="users"),
    path("user_id/", views.get_user_id,name="user_id"),
    path("handle_access_control/", views.handle_access_control,name="handle_access_control"),
    path("get_access_info/", views.get_access_info,name="get_access_info"),
    path("get_event/", views.get_event,name="get_user_events"),
    path("update_attendee_event/", views.update_attendee_event,name="update_attendee_event"),
    
    #Sales management
    #path("sales/", views.get_sales,name="sales"),
    path("update_sales/", views.update_sales,name="update_sales"),
    path("participant/", views.get_participants,name="participants"),#Ateendees
    #path('users/<str:username>', views.current_user,name="users"),
    #path('add/', views.add_items,name="add"),
    #path('bid/<int:id>/', views.bid_item,name="bid"), #Update the current price 
   
]