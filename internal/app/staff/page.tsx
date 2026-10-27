"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Users, UserPlus, ShieldCheck } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "@/components/common/toast";
import {
  Card,
  Button,
  Badge,
  StatusDot,
  TextField,
  SelectField,
  CheckboxField,
  Modal,
  Spinner,
} from "@/components/ui/primitives";

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
    {
      id: "tickets:write",
      label: "Support-Tickets öffentlich beantworten & Status ändern",
    },
    {
      id: "tickets:note",
      label: "Interne Team-Notizen in Support-Tickets verfassen",
    },
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
      toast.success(
        currentActive ? "Mitarbeiter deaktiviert." : "Mitarbeiter aktiviert."
      );
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            Mitarbeiterverwaltung
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            Persönliche Konten, Rollen und granulare Berechtigungen für Region{" "}
            {currentRegion.toUpperCase()}.
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowInviteModal(true)}>
          <UserPlus className="size-4" aria-hidden="true" />
          <span>Mitarbeiter hinzufügen</span>
        </Button>
      </div>

      <Card padding="none">
        {!staffList ? (
          <div className="py-16 flex justify-center">
            <Spinner label="Lade Mitarbeiter..." />
          </div>
        ) : staffList.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center gap-3">
            <Users className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <div className="text-base font-bold text-[var(--zk-text)]">
              Keine Mitarbeiter angelegt
            </div>
            <p className="text-sm text-[var(--zk-text-secondary)]">
              In dieser Region wurden noch keine Mitarbeiter angelegt.
            </p>
            <Button variant="primary" onClick={() => setShowInviteModal(true)}>
              Mitarbeiter hinzufügen
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--zk-border)] bg-[var(--zk-surface-muted)] text-xs font-semibold text-[var(--zk-text-secondary)]">
                  <th className="py-3 px-4">Name & E-Mail</th>
                  <th className="py-3 px-4">Rolle</th>
                  <th className="py-3 px-4">Berechtigungen</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--zk-border)]">
                {staffList.map((s: any) => (
                  <tr key={s._id} className="hover:bg-[var(--zk-surface-muted)]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--zk-text)]">
                        {s.name}
                      </div>
                      <div className="text-xs text-[var(--zk-text-secondary)]">
                        {s.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {s.role === "regional_admin" ? (
                        <Badge variant="info">
                          <ShieldCheck className="size-3.5" aria-hidden="true" />
                          <span>Regional-Admin</span>
                        </Badge>
                      ) : (
                        <Badge variant="neutral">
                          <Users className="size-3.5" aria-hidden="true" />
                          <span>Mitarbeiter</span>
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(s.permissions || []).map((p: string) => (
                          <span
                            key={p}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-[var(--zk-surface-muted)] border border-[var(--zk-border)] font-mono text-xs text-[var(--zk-text)]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5">
                        <StatusDot
                          variant={s.isActive ? "success" : "neutral"}
                          label={s.isActive ? "Aktiv" : "Inaktiv"}
                        />
                        <span>{s.isActive ? "Aktiv" : "Inaktiv"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {s.email !== adminEmail ? (
                        <Button
                          variant={s.isActive ? "destructive" : "secondary"}
                          size="sm"
                          onClick={() => handleToggleStatus(s._id, s.isActive)}
                        >
                          {s.isActive ? "Deaktivieren" : "Aktivieren"}
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        title="Mitarbeiter einladen"
        description={`Erstelle einen persönlichen Zugang für ein neues Teammitglied in Region ${currentRegion.toUpperCase()}.`}
      >
        <form onSubmit={handleInvite} className="flex flex-col gap-4">
          <TextField
            label="Vollständiger Name"
            placeholder="z.B. Alex Müller"
            value={inviteName}
            onChange={setInviteName}
            required
          />

          <TextField
            type="email"
            label="E-Mail-Adresse"
            placeholder="alex@zackisch.com"
            value={inviteEmail}
            onChange={setInviteEmail}
            required
          />

          <SelectField
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
          />

          <div className="flex flex-col gap-2">
            <span className="zk-label">Berechtigungen</span>
            <div className="max-h-52 overflow-y-auto rounded-lg border border-[var(--zk-border)] p-3 flex flex-col gap-1">
              {ALL_PERMISSIONS.map((perm) => (
                <CheckboxField
                  key={perm.id}
                  label={perm.label}
                  checked={selectedPermissions.includes(perm.id)}
                  onChange={() => handleTogglePermission(perm.id)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowInviteModal(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" variant="primary">
              Mitarbeiter anlegen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
