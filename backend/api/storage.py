import os
from django.core.files.storage import FileSystemStorage

class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        
        if self.exists(name):
            base, ext = os.path.splitext(name)
            counter = 1
            while self.exists(f"{base}({counter}){ext}"):
                counter += 1
            name = f"{base}({counter}){ext}"
        return name
