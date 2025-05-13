# rental_api/serializers.py
from rest_framework import serializers
from core_backend.models import Transaction, Account, Entity
from django.contrib.auth import authenticate


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            "id",
            "user",
            "name",
            "type",
            "balance",
            "initial_balance",
            "description",
            "account_number",
            "is_active",
            "is_deleted",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        fields_to_update = ["name", "type", "initial_balance", "description"]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class EntitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Entity
        fields = (
            "id",
            "user",
            "name",
            "company",
            "description",
            "address",
            "is_deleted",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        fields_to_update = ["name", "company", "description", "address"]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class TransactionSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    account_id = serializers.IntegerField(write_only=True)
    entity = EntitySerializer(read_only=True)
    entity_id = serializers.IntegerField(write_only=True)
    date = serializers.DateField(required=False)
    type = serializers.CharField(read_only=True, required=False)

    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "type",
            "account",
            "account_id",
            "date",
            "amount",
            "memo",
            "entity",
            "entity_id",
            "is_reconciled",
            "is_deleted",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        account_id = validated_data.pop("account_id")
        entity_id = validated_data.pop("entity_id")

        try:
            account = Account.objects.get(id=account_id)
        except Account.DoesNotExist:
            raise serializers.ValidationError(
                {"account_id": "Account with this ID does not exist."}
            )
        validated_data["account"] = account

        try:
            entity = Entity.objects.get(id=entity_id)
        except Entity.DoesNotExist:
            raise serializers.ValidationError(
                {"Entity_id": "Entity with this ID does not exist."}
            )
        validated_data["entity"] = entity

        return super().create(validated_data)

    def update(self, instance, validated_data):
        fields_to_update = [
            "date",
            "payee",
            "memo",
            "amount",
            "account_id",
            "entity_id",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance
