import { FC } from "react";
import { Tag } from "../types";

const TagsPanel: FC<{
  tags: Tag[];
  visibleTags: Record<string, boolean>;
  toggleTag: (tag: string) => void;
}> = ({ tags, visibleTags, toggleTag }) => {
  return (
    <div className="tags panel">
      <h2>Tags</h2>
      <ul>
        {tags.map((tag) => (
          <li key={tag.key}>
            <input
              type="checkbox"
              checked={visibleTags[tag.key] || false}
              onChange={() => toggleTag(tag.key)}
              id={`tag-${tag.key}`}
            />
            <label htmlFor={`tag-${tag.key}`}>
              <span className="circle" style={{ backgroundImage: `url(${tag.image})` }} />{" "}
              <span className="label">{tag.key}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsPanel;
