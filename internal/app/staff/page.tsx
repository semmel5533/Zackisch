"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
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
    sessionToken
      ? {
          regionId: currentRegion,
          sessionToken,
        }
      : "skip"
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
        actorEmail: adminEmail,
        sessionToken: sessionToken || undefined,
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
        actorEmail: adminEmail,
        regionId: currentRegion,
        sessionToken: sessionToken || undefined,
      });
      toast.success(currentActive ? "Mitarbeiter deaktiviert." : "Mitarbeiter aktiviert.");
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Mitarbeiterverwaltung
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Persönliche Konten, Rollen und granulare Berechtigungen für Region {currentRegion.toUpperCase()}.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-xs"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Mitarbeiter hinzufügen
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Name & E-Mail</th>
                <th className="py-3.5 px-4">Rolle</th>
                <th className="py-3.5 px-4">Berechtigungen</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {!staffList ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400">
                    Lade Mitarbeiter...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400">
                    Keine Mitarbeiter in dieser Region angelegt.
                  </td>
                </tr>
              ) : (
                staffList.map((s: any) => (
                  <tr key={s._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-zinc-900 text-sm">{s.name}</div>
                      <div className="text-[11px] text-zinc-400">{s.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      {s.role === "regional_admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black text-white">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          Regional-Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
                          <Users className="w-3 h-3 text-zinc-500" />
                          Mitarbeiter
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {s.permissions.map((p: string) => (
                          <span
                            key={p}
                            className="text-[10px] bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded font-mono"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktiv
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-400 font-semibold text-[11px]">
                          <XCircle className="w-3 h-3" />
                          Inaktiv
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {s.email !== adminEmail && (
                        <button
                          onClick={() => handleToggleStatus(s._id, s.isActive)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            s.isActive
                              ? "border-red-200 text-red-600 hover:bg-red-50"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {s.isActive ? "Deaktivieren" : "Aktivieren"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Mitarbeiter einladen</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Erstelle einen persönlichen Zugang für ein neues Teammitglied in Region {currentRegion.toUpperCase()}.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Vollständiger Name</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Alex Müller"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">E-Mail-Adresse</label>
                <input
                  type="email"
                  required
                  placeholder="alex@zackisch.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Rolle</label>
                <select
                  value={inviteRole}
                  onChange={(e: any) => setInviteRole(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                >
                  <option value="staff">Mitarbeiter (Granulare Rechte)</option>
                  <option value="regional_admin">Regional-Admin (Volle Regionsrechte)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-2">Berechtigungen</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto border border-zinc-200 rounded-xl p-3">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => handleTogglePermission(perm.id)}
                        className="rounded border-zinc-300 text-black focus:ring-black"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800"
                >
                  Mitarbeiter anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
