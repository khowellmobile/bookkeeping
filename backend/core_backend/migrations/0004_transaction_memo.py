# Generated by Django 5.2 on 2025-04-14 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_backend', '0003_rename_transactions_transaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='memo',
            field=models.TextField(blank=True, null=True),
        ),
    ]
