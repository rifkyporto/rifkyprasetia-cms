"use client";

import React from 'react'
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProjectDetailType } from '@/composables/project.types'

const Project = ({ project }: { project: ProjectDetailType }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100%",
    // height: "100vw",
    // border: "2px solid red",
    // backgroundColor: "#cccccc",
    margin: "10px",
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full rounded-lg animate-glow cursor-pointer"
      {...listeners} {...attributes}
      ref={setNodeRef} style={style}
    >
      <img
        src={project?.cover_image_url || "https://static.wixstatic.com/media/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.jpg/v1/fit/w_972,h_548,q_90/d9f26d_bfde3c5382e841e290e1026b3784e532~mv2.webp"}
        alt="Project Cover"
        className="w-full rounded-t-lg object-cover h-[250px]"
      />
      <div className="flex justify-between items-start pt-2 pb-4 px-4">
        <div className="flex flex-col pl-1">
          <p className="text-xl">{project?.title}</p>
          <p className="text-gray-500 text-sm font-light">{project.role}, {project.date_month_project}</p>
        </div>
      </div>
    </div>
  )
}

export default Project
