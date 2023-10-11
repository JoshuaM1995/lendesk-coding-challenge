import { SetMetadata } from '@nestjs/common';

/**
 * Disables jwt authentication on a route
 */
export const PublicRoute = () => SetMetadata('isPublic', true);
