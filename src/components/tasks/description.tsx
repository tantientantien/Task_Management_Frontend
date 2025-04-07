import React from "react";
import RichTextEditor from "../ui/richtext-editor";

interface DescriptionProps {
  description?: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setDescription: (description: string) => void;
  handleDescriptionSubmit: () => void;
}

const Description: React.FC<DescriptionProps> = ({
  description = "",
  isEditing,
  setIsEditing,
  setDescription,
  handleDescriptionSubmit,
}) => {
  return (
    <div className="mb-4 text-gray-700 text-sm">
      <p className="text-[1rem] font-medium text-black mb-2">Description</p>
      {!isEditing ? (
        <div
          className="cursor-pointer"
          onClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={{
            __html: description || "<p>No description</p>",
          }}
        />
      ) : (
        <RichTextEditor
          content={description}
          onChange={(newContent) => setDescription(newContent)}
          onSubmit={handleDescriptionSubmit}
          onExitEditMode={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Description;