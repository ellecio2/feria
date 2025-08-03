/* DTOs - Inicio*/

// Vehicle DTOs
export * from './dto/vehicle/create-vehicle.dto';
export * from './dto/vehicle/update-vehicle.dto';
export * from './dto/vehicle/add-image.dto';

// Finance Company DTOs
export * from './dto/finance-company/create-finance-company.dto';
export * from './dto/finance-company/register-finance-company.dto';
export * from './dto/finance-company/update-finance-company.dto';

// Finance Applications DTOs
export * from './dto/finance-applications/create-finance-application.dto';
export * from './dto/finance-applications/create-co-debtor.dto';
export * from './dto/finance-applications/create-reference.dto';
export * from './dto/finance-applications/update-finance-application.dto';
export * from './dto/finance-applications/finance-application-filters.dto';

/* DTOs - Fin */

/* Interfaces - Inicio */

// Base Interface
export * from './interfaces/base.interface';

// Client Interface
export * from './interfaces/client/client.interface';

// Vehicle Interfaces
export * from './interfaces/vehicle/vehicles.interface';
export * from './interfaces/vehicle/vehicle-image.interface';

// Finance Company Interfaces
export * from './interfaces/finance-company/finance-company.interface';
export * from './interfaces/finance-company/payment-calculation.interface';

// Finance Application Interfaces
export * from './interfaces/finance-application/finance-application.interface';
export * from './interfaces/finance-application/co-debtor.interface';
export * from './interfaces/finance-application/reference.interface';

/* Interfaces - Fin */

/* Enums - Inicio */

// Vehicle Enums
export * from './enums/vehicle-status.enum';

// Application Enums
export * from './enums/application-status.enum';

/* Enums - Fin */
