from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, 'user', None)
        if owner is  None:
            owner = getattr(obj, 'sender', obj)
            
        return owner == request.user
