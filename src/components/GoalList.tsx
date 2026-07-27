import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Goal } from '../types';
import { CheckCircle, Circle, Trash2, Pencil, Printer, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface GoalListProps {
  goals: Goal[];
  onGoalsReorder: (goals: Goal[]) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onEditGoal: (goal: Goal) => void;
  onPrintGoal: (goal: Goal) => void;
  currency: string;
}

export function GoalList({
  goals,
  onGoalsReorder,
  onToggleGoal,
  onDeleteGoal,
  onEditGoal,
  onPrintGoal,
  currency
}: GoalListProps) {
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(goals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onGoalsReorder(items);
  };

  if (goals.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500 font-medium">No intentions set yet. Plant a dream to begin.</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="goals">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3 pb-4"
          >
            {goals.map((goal, index) => (
              // @ts-ignore - TS complains about key not being in DraggableProps but it is required by React
              <Draggable key={goal.id} draggableId={goal.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "p-4 rounded-2xl border transition-all relative overflow-hidden group",
                      snapshot.isDragging ? "shadow-lg scale-[1.02] z-50 bg-white border-gray-200" : "shadow-sm hover:shadow-md",
                      goal.isCompleted 
                        ? "bg-gray-50 border-gray-200" 
                        : "bg-white border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <button 
                        onClick={() => onToggleGoal(goal.id)}
                        className={cn(
                          "mt-0.5 flex-shrink-0 transition-colors",
                          goal.isCompleted ? "text-green-500" : "text-gray-300 hover:text-gray-400"
                        )}
                      >
                        {goal.isCompleted ? <CheckCircle size={22} /> : <Circle size={22} />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "text-sm font-medium leading-snug mb-1.5",
                          goal.isCompleted ? "text-gray-400 line-through" : "text-gray-800"
                        )}>
                          {goal.title}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {goal.price !== undefined && (
                            <span className="text-gray-500 font-medium text-[11px] bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                              {currency}{goal.price.toLocaleString()}
                            </span>
                          )}
                          {goal.emotionalWhy && (
                            <span className="text-gray-500 font-medium text-[11px] bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                              {goal.emotionalWhy}
                            </span>
                          )}
                          {goal.reikiSymbol && (
                            <span className="flex items-center gap-1 text-amber-600 font-medium text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                              <Sparkles size={10} />
                              {goal.reikiSymbol.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditGoal(goal)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1.5"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => onPrintGoal(goal)}
                          className="text-gray-400 hover:text-purple-500 transition-colors p-1.5"
                          title="Print Frame"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

