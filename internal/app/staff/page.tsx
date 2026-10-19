"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Users, UserPlus, ShieldCheck } from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { StackItem } from "@astryxdesign/core/Stack";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Table, proportional, pixel } from "@astryxdesign/core/Table";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Token } from "@astryxdesign/core/Token";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Selector } from "@astryxdesign/core/Selector";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "sonner";

export default function StaffPage() {
  const { currentRegion, adminEmail, sessionToken } = useAdmin();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"regional_admin" | "staff">("staff");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "restaurants:read",
    "tickets:read",
    "tickets:write",
    "tickets:note",
    "newsletter:read",
    "newsletter:write",
  ]);

  const staffList = useQuery(
    (anyApi as any).admin.listStaff,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const inviteMutation = useMutation((anyApi as any).admin.inviteStaff);
  const updateStatusMutation = useMutation((anyApi as any).admin.updateStaffStatus);

  const ALL_PERMISSIONS = [
    { id: "restaurants:read", label: "Betriebe einsehen" },
    { id: "restaurants:write", label: "Betriebe bearbeiten" },
    { id: "orders:read", label: "Bestellungen & Zahlungen einsehen" },
    { id: "tickets:read", label: "Support-Tickets einsehen" },
    { id: "tickets:write", label: "Support-Tickets öffentlich beantworten & Status ändern" },
    { id: "tickets:note", label: "Interne Team-Notizen in Support-Tickets verfassen" },
    { id: "newsletter:read", label: "Newsletter einsehen" },
    { id: "newsletter:write", label: "Newsletter verfassen & editieren" },
    { id: "newsletter:send", label: "Newsletter versenden (Massenversand)" },
    { id: "partners:read", label: "Partner & Provisionen einsehen" },
    { id: "partners:write", label: "Partner anlegen & Auszahlungen buchen" },
    { id: "audit:read", label: "Vollständigen Audit-Trail einsehen" },
    { id: "staff:manage", label: "Mitarbeiter verwalten & einladen" },
  ];

  const handleTogglePermission = (id: string) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== id));
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) {
      toast.error("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    try {
      await inviteMutation({
        email: inviteEmail,
        name: inviteName,
        role: inviteRole,
        regionId: currentRegion,
        permissions: selectedPermissions,
        sessionToken: sessionToken || "",
      });
      toast.success(`Mitarbeiter ${inviteName} erfolgreich angelegt!`);
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteName("");
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    }
  };

  const handleToggleStatus = async (staffId: string, currentActive: boolean) => {
    try {
      await updateStatusMutation({
        staffId,
        isActive: !currentActive,
        regionId: currentRegion,
        sessionToken: sessionToken || "",
      });
      toast.success(currentActive ? "Mitarbeiter deaktiviert." : "Mitarbeiter aktiviert.");
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    }
  };

  return (
    <VStack gap={5} maxWidth={1200}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
        <StackItem size="fill">
          <VStack gap={1}>
            <Heading level={1}>Mitarbeiterverwaltung</Heading>
            <Text type="supporting">
              Persönliche Konten, Rollen und granulare Berechtigungen für Region{" "}
              {currentRegion.toUpperCase()}.
            </Text>
          </VStack>
        </StackItem>

        <Button
          label="Mitarbeiter hinzufügen"
          variant="primary"
          icon={<Icon icon={UserPlus} size="sm" />}
          onClick={() => setShowInviteModal(true)}
        />
      </HStack>

      {!staffList ? (
        <VStack hAlign="center" vAlign="center" minHeight={240}>
          <Spinner label="Lade Mitarbeiter..." />
        </VStack>
      ) : staffList.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Users} size="lg" color="secondary" />}
          title="Keine Mitarbeiter angelegt"
          description="In dieser Region wurden noch keine Mitarbeiter angelegt."
          actions={
            <Button
              label="Mitarbeiter hinzufügen"
              variant="primary"
              onClick={() => setShowInviteModal(true)}
            />
          }
        />
      ) : (
        <Table
          data={staffList}
          idKey="_id"
          hasHover
          density="balanced"
          columns={[
            {
              key: "name",
              header: "Name & E-Mail",
              width: proportional(1.5, { minWidth: 180 }),
              renderCell: (s: any) => (
                <VStack gap={0.5}>
                  <Text weight="semibold">{s.name}</Text>
                  <Text type="supporting">{s.email}</Text>
                </VStack>
              ),
            },
            {
              key: "role",
              header: "Rolle",
              width: pixel(160),
              renderCell: (s: any) =>
                s.role === "regional_admin" ? (
                  <Badge
                    variant="neutral"
                    icon={<Icon icon={ShieldCheck} size="xsm" />}
                    label="Regional-Admin"
                  />
                ) : (
                  <Badge
                    variant="gray"
                    icon={<Icon icon={Users} size="xsm" />}
                    label="Mitarbeiter"
                  />
                ),
            },
            {
              key: "permissions",
              header: "Berechtigungen",
              width: proportional(2, { minWidth: 240 }),
              renderCell: (s: any) => (
                <HStack gap={1} wrap="wrap">
                  {(s.permissions || []).map((p: string) => (
                    <Token key={p} label={p} size="sm" />
                  ))}
                </HStack>
              ),
            },
            {
              key: "isActive",
              header: "Status",
              width: pixel(120),
              renderCell: (s: any) => (
                <HStack gap={1.5} vAlign="center">
                  <StatusDot
                    variant={s.isActive ? "success" : "neutral"}
                    label={s.isActive ? "Aktiv" : "Inaktiv"}
                  />
                  <Text>{s.isActive ? "Aktiv" : "Inaktiv"}</Text>
                </HStack>
              ),
            },
            {
              key: "actions",
              header: "Aktionen",
              align: "end",
              width: pixel(140),
              renderCell: (s: any) =>
                s.email !== adminEmail ? (
                  <Button
                    label={s.isActive ? "Deaktivieren" : "Aktivieren"}
                    variant={s.isActive ? "destructive" : "secondary"}
                    size="sm"
                    onClick={() => handleToggleStatus(s._id, s.isActive)}
                  />
                ) : null,
            },
          ]}
        />
      )}

      <Dialog
        isOpen={showInviteModal}
        onOpenChange={setShowInviteModal}
        width={480}
        purpose="form"
      >
        <form onSubmit={handleInvite}>
          <VStack gap={4}>
            <DialogHeader
              title="Mitarbeiter einladen"
              subtitle={`Erstelle einen persönlichen Zugang für ein neues Teammitglied in Region ${currentRegion.toUpperCase()}.`}
              onOpenChange={setShowInviteModal}
            />

            <TextInput
              label="Vollständiger Name"
              placeholder="z.B. Alex Müller"
              value={inviteName}
              onChange={setInviteName}
              isRequired
              width="100%"
            />

            <TextInput
              type="email"
              label="E-Mail-Adresse"
              placeholder="alex@zackisch.com"
              value={inviteEmail}
              onChange={setInviteEmail}
              isRequired
              width="100%"
            />

            <Selector
              label="Rolle"
              value={inviteRole}
              onChange={(val) => setInviteRole(val as "regional_admin" | "staff")}
              options={[
                { value: "staff", label: "Mitarbeiter (Granulare Rechte)" },
                {
                  value: "regional_admin",
                  label: "Regional-Admin (Volle Regionsrechte)",
                },
              ]}
              width="100%"
            />

            <VStack gap={2}>
              <Text type="label">Berechtigungen</Text>
              <VStack gap={1.5} height={200} isScrollable padding={2}>
                {ALL_PERMISSIONS.map((perm) => (
                  <CheckboxInput
                    key={perm.id}
                    label={perm.label}
                    size="sm"
                    value={selectedPermissions.includes(perm.id)}
                    onChange={() => handleTogglePermission(perm.id)}
                  />
                ))}
              </VStack>
            </VStack>

            <Divider />

            <HStack justify="end" gap={2}>
              <Button
                label="Abbrechen"
                variant="secondary"
                onClick={() => setShowInviteModal(false)}
              />
              <Button
                type="submit"
                label="Mitarbeiter anlegen"
                variant="primary"
              />
            </HStack>
          </VStack>
        </form>
      </Dialog>
    </VStack>
  );
}
