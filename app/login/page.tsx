"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Form, { Item, ButtonItem } from "devextreme-react/form";
import notify from "devextreme/ui/notify";
import { login } from "@/services/auth";
import { AuthModel } from "@/model/auth";

export default function LoginPage() {
  const router = useRouter();
  const [model, setModel] = useState<AuthModel>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!model.username || !model.password) {
      notify("Username and password required", "warning", 1500);
      return;
    }

    setLoading(true);
    try {
      await login(model.username, model.password);
      notify("Login successful", "success", 1200);
      router.push("/users");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Login failed", "error", 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#fafafa",
      }}
    >
      <div
        style={{
          width: 420,
          background: "#fff",
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2 style={{ margin: 0, marginBottom: 12 }}>Login</h2>

        <Form
          formData={model}
          labelLocation="top"
          onFieldDataChanged={(e) => {
            setModel((prev) => ({ ...prev, [e.dataField!]: e.value }));
          }}
        >
          <Item dataField="username" label={{ text: "Username" }} isRequired />
          <Item
            dataField="password"
            label={{ text: "Password" }}
            isRequired
            editorType="dxTextBox"
            editorOptions={{ mode: "password" }}
          />

          <ButtonItem
            horizontalAlignment="right"
            buttonOptions={{
              text: loading ? "Signing in..." : "Sign in",
              type: "default",
              onClick: onLogin,
              disabled: loading,
            }}
          />
        </Form>

        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
          Demo credentials (from /users seed): <b>johnd</b> / <b>m38rmF$</b>
        </div>
      </div>
    </div>
  );
}