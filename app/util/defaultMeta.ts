import type { MetaDescriptor } from "react-router";

interface DefaultMetaProps {
    title?: string;
    description?: string;
}

export const getDefaultMeta = ({ title = "thingy", description = "thingy frontend" }: DefaultMetaProps = {}): MetaDescriptor[] => [
    { title },
    {
        name: "title",
        content: title
    },
    {
        name: "description",
        content: description
    },
    // open graph
    {
        property: "og:type",
        content: "website"
    },
    {
        property: "og:title",
        content: title
    },
    {
        property: "og:description",
        content: description
    },
    {
        property: "og:image",
        content: "/android-chrome-512x512.png"
    },
    // twitter
    {
        property: "twitter:card",
        content: "summary_large_image"
    },
    {
        property: "twitter:title",
        content: title
    },
    {
        property: "twitter:description",
        content: description
    },
    {
        property: "twitter:image",
        content: "/android-chrome-512x512.png"
    }
];
