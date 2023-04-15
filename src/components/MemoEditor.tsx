import { useGlobalStore } from "@/store/global";
import { useUserStore } from "@/store/user";
import Editor, { EditorRefActions } from "./Editor/Editor";
import { useMemo, useRef, useState } from "react";
import * as storage from "@/helper/storage";

interface State {
    fullscreen: boolean;
    isUploadingResource: boolean;
    isRequesting: boolean;
}

const getEditorContentCache = (): string => {
    return storage.get(["editorContentCache"]).editorContentCache ?? "";
}

const setEditorContentCache = (content: string) => {
    storage.set({
        editorContentCache: content,
    });
}

function MemoEditor() {

    const { state: { systemStatus } } = useGlobalStore()
    const userStore = useUserStore()

    const [state, setState] = useState<State>({
        fullscreen: false,
        isUploadingResource: false,
        isRequesting: false
    })
    const [allowSave, setAllowSave] = useState<boolean>(false);

    const editorRef = useRef<EditorRefActions>(null)

    const handleContentChange = (content: string) => {
        setAllowSave(content !== "");
        setEditorContentCache(content);
    }

    const handleUploadResource = async (file: File) => {
        setState((state) => {
            return {
                ...state,
                isUploadingResource: true,
            };
        });

        let resource = undefined;
        try {
            resource = await resourceStore.createResourceWithBlob(file);
        } catch (error: any) {
            console.error(error);
            // toast.error(error.response.data.message);
        }

        setState((state) => {
            return {
                ...state,
                isUploadingResource: false,
            };
        });
        return resource;
    }

    const uploadMultiFiles = async (files: FileList) => {
        const uploadedResourceList: Resource[] = [];
        for (const file of files) {
            const resource = await handleUploadResource(file);
            if (resource) {
                uploadedResourceList.push(resource);
                if (editorState.editMemoId) {
                    await upsertMemoResource(editorState.editMemoId, resource.id);
                }
            }
        }
        if (uploadedResourceList.length > 0) {
            const resourceList = editorStore.getState().resourceList;
            editorStore.setResourceList([...resourceList, ...uploadedResourceList]);
        }
    }

    const handlePasteEvent = async (event: React.ClipboardEvent) => {
        if (event.clipboardData && event.clipboardData.files.length > 0) {
            event.preventDefault();
            await uploadMultiFiles(event.clipboardData.files);
        }
    }


    const editorConfig = useMemo(() => ({
        className: `memo-editor`,
        initialContent: getEditorContentCache(),
        placeholder: `enter memo`,
        fullscreen: state.fullscreen,
        onContentChange:,
        onPaste:
    }), [state.fullscreen])

    return (
        <div>
            <Editor ref={editorRef} {...editorConfig} />
        </div>
    )
}