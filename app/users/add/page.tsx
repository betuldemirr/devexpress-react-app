"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Form, { Item, ButtonItem, GroupItem } from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import { UserCreate } from "@/model/user";

export default function AddUserPage() {
  const router = useRouter();
  const [model, setModel] = useState<UserCreate>({
    email: "",
    username: "",
    password: "",
    name: { firstname: "", lastname: "" },
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  const onCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(model),
      });
      if (!res.ok) throw new Error("Create failed");
      notify("Created", "success", 1200);
      router.push("/users");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error", "error", 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>New User</h2>

      <Form
        formData={model}
        labelLocation="top"
        onFieldDataChanged={(e) => {
          setModel((prev) => ({ ...prev, [e.dataField!]: e.value } as any));
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
            text: saving ? "Creating..." : "Create",
            type: "default",
            onClick: onCreate,
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