# Generated by Django 5.2 on 2025-04-14 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_backend', '0004_transaction_memo'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='isReconciled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='transaction',
            name='payee',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
