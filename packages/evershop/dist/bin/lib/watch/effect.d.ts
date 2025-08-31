import { Application } from 'express';
import { Event } from './watchHandler.js';
export type Effect = 'restart' | 'restart_cronjob' | 'restart_event' | 'add_middleware' | 'remove_middleware' | 'update_middleware' | 'add_component' | 'remove_component' | 'update_component' | 'add_api_route' | 'remove_api_route' | 'update_api_route' | 'add_admin_route' | 'remove_admin_route' | 'update_admin_route' | 'add_front_store_route' | 'remove_front_store_route' | 'update_front_store_route' | 'update_graphql' | 'unknown';
export declare function detectEffect(event: Event): Effect;
export declare function applyEffects(events: Event[], app: Application): void;
