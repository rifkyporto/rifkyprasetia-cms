"use client";

import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { upsertAllProjectPosition, upsertCategoryProjectPosition } from '@/app/projects/action';
import { ProjectDetailType } from '@/composables/project.types';
import Project from './items';
import { reorderDragNDrop } from '@/lib/utils';
import { IProjectCategories } from '@/composables/project-categories.type';

const ReorderCategoryProjects = ({ projects }: { projects: IProjectCategories[] }) => {
  const [activeId, setActiveId] = useState(null);
  const [projectsReorder, setProjectsReorder] = useState<IProjectCategories[]>(projects.sort((a, b) => a.position! - b.position!));
  console.log({projectsReorder})
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    console.log({active, over})
    if (active.id !== over.id) {
      const res: any = reorderDragNDrop(projectsReorder, active?.data?.current?.sortable?.index, over?.data?.current?.sortable?.index).map((dataSection: Partial<ProjectDetailType>, idx) => {
        return {
          ...dataSection,
          position: idx,
        }
      });
      console.log({res})
      setProjectsReorder(res)
      upsertCategoryProjectPosition(res)
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-5'
      >
        <SortableContext items={projectsReorder} strategy={rectSortingStrategy}>
          {projectsReorder.map((project, index) => (
            <Project id={project.id} project={project.projects}/>
          ))}
          {/* <DragOverlay>
            {activeId ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "red"
                }}
              ></div>
            ) : null}
          </DragOverlay> */}
        </SortableContext>
      </div>
    </DndContext>
  )
}

export default ReorderCategoryProjects
