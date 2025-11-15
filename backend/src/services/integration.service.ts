import prisma from '../config/database';
import { IntegrationType } from '@prisma/client';

export class IntegrationService {
  async getIntegrations(storeId: string) {
    return prisma.integration.findMany({
      where: { storeId },
    });
  }

  async connectShopify(data: any) {
    return prisma.integration.create({
      data: {
        storeId: data.storeId,
        type: IntegrationType.SHOPIFY,
        credentials: data.credentials,
        config: data.config || {},
      },
    });
  }

  async connectWooCommerce(data: any) {
    return prisma.integration.create({
      data: {
        storeId: data.storeId,
        type: IntegrationType.WOOCOMMERCE,
        credentials: data.credentials,
        config: data.config || {},
      },
    });
  }

  async connectWhatsApp(data: any) {
    return prisma.integration.create({
      data: {
        storeId: data.storeId,
        type: IntegrationType.WHATSAPP,
        credentials: data.credentials,
        config: data.config || {},
      },
    });
  }

  async deleteIntegration(id: string) {
    await prisma.integration.delete({
      where: { id },
    });
  }
}
