import * as api from "@/helper/api";
import store, { useAppSelector } from ".";
import { deleteTag, setTags, upsertTag } from "./reduer/tag";
import { useUserStore } from "./user";

export const useTagStore = () => {
  const state = useAppSelector((state) => state.tag);
  const userStore = useUserStore();
  return {
    state,
    getState: () => {
      return store.getState().tag;
    },
    fetchTags: async () => {
      const tagFind: TagFind = {};
      if (userStore.isVisitorMode()) {
        tagFind.creatorId = userStore.getUserIdFromPath()
      }
      const { data } = (await api.getTagList(tagFind))
      store.dispatch(setTags(data as string[]));
    },
    upsertTag: async (tagName: string) => {
      await api.upsertTag(tagName);
      store.dispatch(upsertTag(tagName));
    },
    deleteTag: async (tagName: string) => {
      await api.deleteTag(tagName);
      store.dispatch(deleteTag(tagName));
    },
  };
}