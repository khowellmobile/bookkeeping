# Generated by Django 5.2 on 2025-06-23 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_backend', '0027_rentpayment_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='rentpayment',
            name='status',
            field=models.CharField(choices=[('scheduled', 'Scheduled'), ('paid', 'Paid'), ('due', 'Due'), ('overdue', 'Overdue')], default='residential', max_length=25),
        ),
    ]
