"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import DataGrid, {
  Column,
  Paging,
  Pager,
  SearchPanel,
  FilterRow,
  Editing,
} from "devextreme-react/data-grid";
import Button from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { createDxStore } from "@/lib/dxstore";
import { logout } from "@/services/auth";
import { User } from "@/model/user";

export default function UsersPage() {
  const router = useRouter();

  const store = useMemo(
    () =>
      createDxStore<User>({
        key: "id",
        endpoints: {
          list: "/api/users",
          create: "/api/users",
          byId: (id) => `/api/users/${id}`,
        },
      }),
    []
  );

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Users</h2>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button
            text="Add New User"
            type="default"
            stylingMode="contained"
            onClick={() => router.push("/users/add")}
          />
          <Button
            text="Orders"
            type="normal"
            stylingMode="contained"
            onClick={() => router.push("/carts")}
          />
          <Button
            text="Products"
            type="normal"
            stylingMode="contained"
            onClick={() => router.push("/products")}
          />
          <Button
            text="Logout"
            type="danger"
            stylingMode="contained"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
          />
        </div>
      </div>

      <DataGrid
        dataSource={store}
        keyExpr="id"
        showBorders
        columnAutoWidth
        onDataErrorOccurred={(e) =>
          notify(e.error?.message ?? "Error", "error", 2000)
        }
      >
        <SearchPanel visible />
        <FilterRow visible />

        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector allowedPageSizes={[10, 20, 50]} showInfo />

        <Editing mode="row" allowDeleting useIcons />

        <Column
          caption="Actions"
          width={120}
          cellRender={(cell) => (
            <Button
              text="Edit"
              type="normal"
              stylingMode="text"
              onClick={() => router.push(`/users/${cell.data.id}`)}
            />
          )}
        />

        <Column dataField="id" caption="ID" width={70} allowEditing={false} />
        <Column dataField="username" caption="Username" />
        <Column dataField="email" caption="Email" />
        <Column dataField="phone" caption="Phone" />
        <Column dataField="name.firstname" caption="First Name" />
        <Column dataField="name.lastname" caption="Last Name" />
      </DataGrid>
    </div>
  );
}
