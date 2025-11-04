import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase } from '../../db/index.js';
import { leads } from '../../db/schema.js';

interface LeadBody {
  name: string;
  email: string;
  company?: string;
  description?: string;
  form_type: 'scan' | 'challenge';
}

export async function leadsRoutes(app: FastifyInstance) {
  // Create a new lead
  app.post(
    '/leads',
    async (
      request: FastifyRequest<{ Body: LeadBody }>,
      reply: FastifyReply
    ) => {
      try {
        const { name, email, company, description, form_type } = request.body;

        // Validate required fields
        if (!name || !email || !form_type) {
          return reply.status(400).send({
            error: 'Missing required fields: name, email, and form_type are required',
          });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return reply.status(400).send({
            error: 'Invalid email format',
          });
        }

        // Validate form_type
        if (form_type !== 'scan' && form_type !== 'challenge') {
          return reply.status(400).send({
            error: 'Invalid form_type. Must be "scan" or "challenge"',
          });
        }

        // Insert lead into database
        const db = getDatabase();
        const result = await db.insert(leads).values({
          name,
          email,
          company: company || null,
          description: description || null,
          formType: form_type,
          status: 'new',
        }).returning();

        app.log.info({
          leadId: result[0].id,
          email,
          formType: form_type,
        }, 'New lead created');

        return reply.status(201).send({
          success: true,
          message: 'Lead created successfully',
          data: result[0],
        });
      } catch (error) {
        app.log.error({ error }, 'Error creating lead');
        return reply.status(500).send({
          error: 'Failed to create lead',
        });
      }
    }
  );

  // Get all leads (for admin/internal use)
  app.get('/leads', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const db = getDatabase();
      const allLeads = await db.select().from(leads);
      
      return reply.send({
        success: true,
        data: allLeads,
      });
    } catch (error) {
      app.log.error({ error }, 'Error fetching leads');
      return reply.status(500).send({
        error: 'Failed to fetch leads',
      });
    }
  });
}

