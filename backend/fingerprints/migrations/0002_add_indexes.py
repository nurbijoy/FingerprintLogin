# Generated migration for adding database indexes

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fingerprints', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='fingerprint',
            index=models.Index(fields=['user'], name='fingerprints_user_idx'),
        ),
        migrations.AddIndex(
            model_name='fingerprint',
            index=models.Index(fields=['quality_score'], name='fingerprints_quality_idx'),
        ),
        migrations.AddIndex(
            model_name='fingerprint',
            index=models.Index(fields=['-created_at'], name='fingerprints_created_idx'),
        ),
    ]
