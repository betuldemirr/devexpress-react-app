"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import { User } from "@/model/user";

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [model, setModel] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        notify("Failed to load user", "error", 2000);
        return;
      }
      setModel(await res.json());
    })();
  }, [id]);

  const save = async () => {
    if (!model) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(model),
      });
      if (!res.ok) throw new Error("Update failed");
      notify("Saved", "success", 1200);
      router.push("/users");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error", "error", 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!model) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>Edit User #{id}</h2>

      <Form
        formData={model}
        labelLocation="top"
        onFieldDataChanged={(e) => {
          setModel((prev) => ({ ...(prev as User), [e.dataField!]: e.value }));
        }}
      >
        <GroupItem colCount={2} caption="Account">
          <Item dataField="username" isRequired />
          <Item dataField="email" isRequired />
          <Item
            dataField="password"
            editorType="dxTextBox"
            editorOptions={{ mode: "password" }}
            isRequired
          />
          <Item dataField="phone" />
        </GroupItem>

        <GroupItem colCount={2} caption="Name">
          <Item dataField="name.firstname" />
          <Item dataField="name.lastname" />
        </GroupItem>

        <ButtonItem
          horizontalAlignment="right"
          buttonOptions={{
            text: saving ? "Saving..." : "Save",
            type: "default",
            onClick: save,
            disabled: saving,
          }}
        />
        <ButtonItem
          horizontalAlignment="left"
          buttonOptions={{
            text: "Cancel",
            type: "normal",
            onClick: () => router.push("/users"),
          }}
        />
      </Form>
    </div>
  );
}