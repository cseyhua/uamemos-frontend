interface Resource {
    id: ResourceId;

    createdTs: TimeStamp;
    updatedTs: TimeStamp;

    filename: string;
    externalLink: string;
    type: string;
    size: string;
    publicId: string;

    linkedMemoAmount: number;
}

type ResourceId = number;