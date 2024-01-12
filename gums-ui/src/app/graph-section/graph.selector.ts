import { GRAPH_REDUCER, graphReducer, GraphState } from "./graph.reducer";
import { createFeatureSelector } from "@ngrx/store";

export const selectGraphState = createFeatureSelector<GraphState>(GRAPH_REDUCER);