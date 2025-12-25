"use client";

import { useMemo } from "react";
import DataGrid, {
  Column,
  Paging,
  Pager,
  SearchPanel,
  FilterRow,
  Editing,
} from "devextreme-react/data-grid";
import notify from "devextreme/ui/notify";
import { createDxStore } from "@/lib/dxstore";
import { useRouter } from "next/navigation";
import { Button } from "devextreme-react";
import { logout } from "@/services/auth";
import { Product } from "@/model/product";

export default function ProductsPage() {
  const router = useRouter();

  const store = useMemo(
    () =>
      createDxStore<Product>({
        key: "id",
        endpoints: {
          list: "/api/products",
          create: "/api/products",
          byId: (id) => `/api/products/${id}`,
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
        <h2 style={{ margin: 0 }}>Products</h2>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button
            text="Users"
            type="normal"
            stylingMode="contained"
            onClick={() => router.push("/users")}
          />
          <Button
            text="Orders"
            type="normal"
            stylingMode="contained"
            onClick={() => router.push("/carts")}
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

        <Editing mode="form" allowAdding allowUpdating allowDeleting useIcons />

        <Column dataField="id" caption="ID" width={70} allowEditing={false} />
        <Column dataField="title" caption="Title" />
        <Column
          dataField="price"
          caption="Price"
          dataType="number"
          format="#,##0.00"
          width={120}
        />
        <Column dataField="category" caption="Category" width={160} />
        <Column dataField="description" caption="Description" />
        <Column dataField="image" caption="Image URL" />
      </DataGrid>
    </div>
  );
}
