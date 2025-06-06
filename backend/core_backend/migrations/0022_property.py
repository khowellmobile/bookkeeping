# Generated by Django 5.2 on 2025-06-03 12:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core_backend', '0021_alter_entity_email'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255, null=True)),
                ('property_type', models.CharField(choices=[('residential', 'Residential'), ('commercial', 'Commercial'), ('multi_unit', 'Multi-Unit')], default='residential', max_length=25, null=True)),
                ('number_of_units', models.DecimalField(decimal_places=0, max_digits=4, null=True)),
                ('rent', models.DecimalField(decimal_places=2, max_digits=10, null=True)),
                ('notes', models.JSONField(null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('accounts', models.ManyToManyField(blank=True, related_name='properties', to='core_backend.account')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='properties', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
