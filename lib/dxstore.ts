import CustomStore from "devextreme/data/custom_store";

type CreateStoreParams<T> = {
  key: string;
  endpoints: {
    list: string;
    create: string;
    byId: (id: number | string) => string;
  };
  mapInsert?: (values: Partial<T>) => unknown;
  mapUpdate?: (values: Partial<T>) => unknown;
};

export function createDxStore<T extends Record<string, any>>(params: CreateStoreParams<T>) {
  return new CustomStore<T, number | string>({
    key: params.key,
    load: async () => {
      const res = await fetch(params.endpoints.list);
      if (!res.ok) throw new Error("Load failed");
      return await res.json();
    },
    insert: async (values) => {
      const res = await fetch(params.endpoints.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.mapInsert ? params.mapInsert(values) : values),
      });
      if (!res.ok) throw new Error("Create failed");
      return await res.json();
    },
    update: async (key, values) => {
      const res = await fetch(params.endpoints.byId(key), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.mapUpdate ? params.mapUpdate(values) : values),
      });
      if (!res.ok) throw new Error("Update failed");
      return await res.json();
    },
    remove: async (key) => {
      const res = await fetch(params.endpoints.byId(key), { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return await res.json();
    },
  });
}