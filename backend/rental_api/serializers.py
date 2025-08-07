# rental_api/serializers.py
from rest_framework import serializers
from core_backend.models import (
    Transaction,
    Account,
    Entity,
    JournalItem,
    Journal,
    Property,
    RentPayment,
    User,
)


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
        fields_to_update = [
            "name",
            "type",
            "initial_balance",
            "description",
            "is_deleted",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class PropertySerializer(serializers.ModelSerializer):
    accounts = AccountSerializer(many=True, read_only=True)
    account_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="List of Account IDs to link to this property.",
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Property
        fields = (
            "id",
            "user",
            "address",
            "accounts",
            "account_ids",
            "name",
            "property_type",
            "number_of_units",
            "rent",
            "current_rent_due",
            "notes",
            "is_active",
            "is_deleted",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        account_ids = validated_data.pop("account_ids", [])
        user = self.context["request"].user
        validated_data["user"] = user

        property_instance = super().create(validated_data)

        if account_ids:
            accounts_to_link = Account.objects.filter(id__in=account_ids, user=user)
            property_instance.accounts.set(accounts_to_link)

        return property_instance

    def update(self, instance, validated_data):
        account_ids = validated_data.pop("account_ids", None)

        fields_to_update = [
            "address",
            "name",
            "property_type",
            "number_of_units",
            "rent",
            "current_rent_due",
            "notes",
            "is_active",
            "is_deleted",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()

        if account_ids is not None:
            accounts_to_link = Account.objects.filter(
                id__in=account_ids, user=self.context["request"].user
            )
            instance.accounts.set(accounts_to_link)

        return instance


class EntitySerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    property = PropertySerializer(read_only=True)
    property_id = serializers.IntegerField(required=False, write_only=True)

    class Meta:
        model = Entity
        fields = (
            "id",
            "user",
            "property",
            "property_id",
            "name",
            "company",
            "description",
            "address",
            "phone_number",
            "email",
            "is_deleted",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        property_id = validated_data.pop("property_id", None)
        if property_id is not None:
            try:
                prop_obj = Property.objects.get(id=property_id)
                instance.property = prop_obj
            except Property.DoesNotExist:
                raise serializers.ValidationError(
                    {"property_id": "Property with this ID does not exist."}
                )

        fields_to_update = [
            "name",
            "company",
            "address",
            "phone_number",
            "email",
            "is_deleted",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class TransactionSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    account_id = serializers.IntegerField(write_only=True)
    property = PropertySerializer(read_only=True)
    property_id = serializers.IntegerField(required=False, write_only=True)
    entity = EntitySerializer(read_only=True)
    entity_id = serializers.IntegerField(write_only=True)
    date = serializers.DateField(required=False)
    type = serializers.CharField(required=False)

    class Meta:
        model = Transaction
        fields = (
            "id",
            "user",
            "type",
            "account",
            "account_id",
            "property",
            "property_id",
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
            account = Account.objects.get(id=account_id, user=user)
        except Account.DoesNotExist:
            raise serializers.ValidationError(
                {"account_id": "Account with this ID does not exist."}
            )
        validated_data["account"] = account

        try:
            entity = Entity.objects.get(id=entity_id, user=user)
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
            "is_deleted",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class JournalItemSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    account = AccountSerializer(read_only=True)
    account_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = JournalItem
        fields = (
            "user",
            "account",
            "account_id",
            "type",
            "amount",
            "memo",
            "is_deleted",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        fields_to_update = [
            "account",
            "type",
            "amount",
            "memo",
            "is_deleted",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class JournalSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    journal_items = JournalItemSerializer(many=True, read_only=True)

    class Meta:
        model = Journal
        fields = (
            "id",
            "user",
            "name",
            "date",
            "journal_items", 
            "is_deleted",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        user = self.context["request"].user
        journal_items_data = validated_data.pop("journal_items")

        journal = Journal.objects.create(user=user, **validated_data)

        for item_data in journal_items_data:
            JournalItem.objects.create(journal=journal, user=user, **item_data)

        return journal

    def update(self, instance, validated_data):
        fields_to_update = ["name", "date", "is_deleted"]
        # The update method should handle journal_items separately if needed

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class RentPaymentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    property = PropertySerializer(read_only=True)
    property_id = serializers.IntegerField(required=False, write_only=True)
    entity = EntitySerializer(read_only=True)
    entity_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = RentPayment
        fields = (
            "id",
            "user",
            "property",
            "property_id",
            "entity",
            "entity_id",
            "amount",
            "date",
            "status",
            "is_deleted",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        user = self.context["request"].user
        validated_data["user"] = user
        entity_id = validated_data.pop("entity_id")

        try:
            entity = Entity.objects.get(id=entity_id, user=user)
        except Entity.DoesNotExist:
            raise serializers.ValidationError(
                {"Entity_id": "Entity with this ID does not exist."}
            )
        validated_data["entity"] = entity

        return super().create(validated_data)

    def update(self, instance, validated_data):
        fields_to_update = [
            "property",
            "entity",
            "amount",
            "date",
            "status",
            "is_deleted",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, focused on user-editable profile fields.
    Does NOT include sensitive fields like password.
    """

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "date_joined",
            "last_login",
        )
        read_only_fields = (
            "id",
            "username",
            "date_joined",
            "last_login",
        )

    def update(self, instance, validated_data):
        """
        Custom update method for the User model.
        Handles specific fields for user profile updates.
        """

        validated_data.pop("username", None)

        fields_to_update = [
            "email",
            "first_name",
            "last_name",
            "is_active",
        ]

        for attr in fields_to_update:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        instance.save()
        return instance
