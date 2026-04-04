"use client";

import Card from "@/components/Card";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!current || !newPass || !confirm) {
      return setError("Please fill all fields");
    }

    if (newPass.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    if (newPass !== confirm) {
      return setError("Passwords do not match");
    }

    setError("");
    alert("Password updated successfully!");
  };

  return (
    <div className="space-y-8">

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Change Password
        </h1>
        <p className="text-sm text-muted">
          Update your account security
        </p>
      </div>

      {/* Form */}
      <Card className="space-y-6">

        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Current Password
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Enter current password"
            className="
              bg-background
              border border-default
              rounded-xl px-4 py-3
              text-foreground
              placeholder:text-muted
              shadow-sm
              outline-none
              focus:ring-2 focus:ring-teal-500
              focus:border-teal-500
              transition
            "
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            New Password
          </label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Enter new password"
            className="
              bg-background
              border border-default
              rounded-xl px-4 py-3
              text-foreground
              placeholder:text-muted
              shadow-sm
              outline-none
              focus:ring-2 focus:ring-teal-500
              focus:border-teal-500
              transition
            "
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="
              bg-background
              border border-default
              rounded-xl px-4 py-3
              text-foreground
              placeholder:text-muted
              shadow-sm
              outline-none
              focus:ring-2 focus:ring-teal-500
              focus:border-teal-500
              transition
            "
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="
              px-6 py-3 rounded-xl
              bg-teal-600 hover:bg-teal-700
              text-white font-medium
              shadow-md
              hover:shadow-lg
              transition
            "
          >
            Update Password
          </button>
        </div>

      </Card>
    </div>
  );
}