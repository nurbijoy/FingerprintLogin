from django.db import models
from users.models import User


class Fingerprint(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fingerprints')
    template_data = models.BinaryField()
    quality_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'fingerprints'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user'], name='fingerprints_user_idx'),
            models.Index(fields=['quality_score'], name='fingerprints_quality_idx'),
            models.Index(fields=['-created_at'], name='fingerprints_created_idx'),
        ]

    def __str__(self):
        return f"Fingerprint for {self.user.emp_id}"
