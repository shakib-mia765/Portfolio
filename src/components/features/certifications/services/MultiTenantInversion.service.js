const DEFAULT_TENANT = "public";

class MultiTenantInversionService {
  constructor({ tenantProvider, services = {} } = {}) {
    if (typeof tenantProvider !== "function") {
      throw new TypeError("tenantProvider must be a function.");
    }
    this.tenantProvider = tenantProvider;
    this.services = new Map(Object.entries(services));
  }
  register(name, factory) {
    if (!name || typeof factory !== "function") {
      throw new TypeError("Service name and factory are required.");
    }
    this.services.set(name, factory);
    return this;
  }
  async resolve(name, context = {}) {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service "${name}" is not registered.`);
    }
    const tenant = await Promise.resolve(
      this.tenantProvider(context)
    );
    const scope = Object.freeze({
      tenantId: tenant?.id ?? DEFAULT_TENANT,
      tenant,
      context,
    });
    return factory(scope);
  }
  has(name) {
    return this.services.has(name);
  }
  remove(name) {
    return this.services.delete(name);
  }
}

export { DEFAULT_TENANT, MultiTenantInversionService };
export default MultiTenantInversionService;
