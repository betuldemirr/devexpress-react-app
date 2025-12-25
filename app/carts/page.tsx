"use client";

import { useCallback, useEffect, useState } from "react";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Pager,
  Selection,
  Toolbar,
  Item as ToolbarItem,
} from "devextreme-react/data-grid";
import SelectBox from "devextreme-react/select-box";
import DateBox from "devextreme-react/date-box";
import notify from "devextreme/ui/notify";

import { getUsers } from "@/services/users";
import { getCarts, updateCart } from "@/services/carts";

import type { User } from "@/model/user";
import type { Cart } from "@/model/cart";
import { Button } from "devextreme-react";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";

type CartItemRow = {
  productId: number;
  quantity: number;
};

function formatDate(d: Date | null) {
  return d ? d.toISOString().split("T")[0] : undefined;
}

export default function CartsPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [carts, setCarts] = useState<Cart[]>([]);

  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItemRow[]>([]);

  const [userId, setUserId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => notify("Failed to load users", "error", 2000));
  }, []);

  const loadCarts = useCallback(async () => {
    try {
      const data = await getCarts({
        userId: userId ?? undefined,
        startdate: formatDate(startDate),
        enddate: formatDate(endDate),
      });

      setCarts(data);
      setSelectedCart(null);
      setItems([]);
    } catch (e) {
      console.error(e);
      notify("Failed to load carts", "error", 2000);
    }
  }, [userId, startDate, endDate]);

  useEffect(() => {
    loadCarts();
  }, [loadCarts]);

  const onSelectCart = (cart: Cart | null) => {
    setSelectedCart(cart);

    const raw = cart?.products;
    const safe = Array.isArray(raw) ? raw : [];

    setItems(
      safe.map((p: any) => ({
        productId: Number(p.productId),
        quantity: Number(p.quantity) || 1,
      }))
    );
  };

  const saveItemsToSelectedCart = useCallback(
    async (nextItems: CartItemRow[]) => {
      if (!selectedCart) return;

      const payload: Partial<Cart> = {
        userId: selectedCart.userId,
        date: selectedCart.date,
        products: nextItems as any,
      };

      try {
        await updateCart(selectedCart.id, payload);

        const nextCart: Cart = { ...selectedCart, products: nextItems as any };
        setSelectedCart(nextCart);
        setItems(nextItems);

        setCarts((prev) =>
          prev.map((c) => (c.id === nextCart.id ? nextCart : c))
        );
      } catch (e) {
        console.error(e);
        notify("Failed to save cart items", "error", 2000);
      }
    },
    [selectedCart]
  );

  const onItemInserted = async (e: any) => {
    const next = [
      ...items,
      {
        productId: Number(e.data.productId),
        quantity: Number(e.data.quantity) || 1,
      },
    ];
    await saveItemsToSelectedCart(next);
  };

  const onItemUpdated = async (e: any) => {
    const next = items.map((item) =>
      item.productId === e.key
        ? {
            productId: Number(e.data.productId ?? item.productId),
            quantity: Number(e.data.quantity ?? item.quantity),
          }
        : item
    );

    const normalized: CartItemRow[] = [];
    for (const x of next) {
      const exist = normalized.find((n) => n.productId === x.productId);
      if (exist) exist.quantity = x.quantity;
      else normalized.push(x);
    }

    await saveItemsToSelectedCart(normalized);
  };

  const onItemRemoved = async (e: any) => {
    const next = items.filter((item) => item.productId !== e.key);
    await saveItemsToSelectedCart(next);
  };

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
        <h2 style={{ margin: 0 }}>Orders (Carts)</h2>

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
        dataSource={carts}
        keyExpr="id"
        showBorders
        height={340}
        columnAutoWidth
        onRowClick={(e) => onSelectCart(e.data)}
      >
        <Toolbar>
          <ToolbarItem location="before">
            <DateBox
              type="date"
              placeholder="Start Date"
              value={startDate}
              onValueChanged={(e) => setStartDate(e.value ?? null)}
              width={170}
            />
          </ToolbarItem>

          <ToolbarItem location="before">
            <DateBox
              type="date"
              placeholder="End Date"
              value={endDate}
              onValueChanged={(e) => setEndDate(e.value ?? null)}
              width={170}
            />
          </ToolbarItem>

          <ToolbarItem location="before">
            <SelectBox
              dataSource={users}
              valueExpr="id"
              displayExpr="username"
              placeholder="users"
              value={userId}
              onValueChanged={(e) => setUserId(e.value ?? null)}
              width={200}
            />
          </ToolbarItem>
        </Toolbar>

        <Selection mode="single" />

        <Paging defaultPageSize={8} />
        <Pager showPageSizeSelector allowedPageSizes={[8, 16, 32]} showInfo />

        <Column
          dataField="id"
          caption="Order No"
          width={110}
          allowEditing={false}
        />
        <Column
          dataField="userId"
          caption="User ID"
          width={130}
          dataType="number"
        />
        <Column dataField="date" caption="Date" dataType="date" />
      </DataGrid>

      {selectedCart && (
        <div style={{ marginTop: 18 }}>
          <h3 style={{ margin: "8px 0 12px" }}>
            Order #{selectedCart.id} Product
          </h3>

          <DataGrid
            dataSource={items}
            keyExpr="productId"
            showBorders
            columnAutoWidth
            onRowInserted={onItemInserted}
            onRowUpdated={onItemUpdated}
            onRowRemoved={onItemRemoved}
          >
            <Paging defaultPageSize={8} />
            <Pager
              showPageSizeSelector
              allowedPageSizes={[8, 16, 32]}
              showInfo
            />

            <Editing
              mode="row"
              allowAdding
              allowUpdating
              allowDeleting
              useIcons
            />

            <Column
              dataField="productId"
              caption="Ürün ID"
              width={140}
              dataType="number"
            />
            <Column
              dataField="quantity"
              caption="Adet"
              width={140}
              dataType="number"
            />
          </DataGrid>
        </div>
      )}
    </div>
  );
}
