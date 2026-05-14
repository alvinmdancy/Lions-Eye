import { supabase } from '@/api/supabaseClient';

// Maps base44 entity names to Supabase table names
const TABLE_MAP = {
    SavedConfig: 'saved_configs',
    ResourceLink: 'resource_links',
    Project: 'projects',
    Badge: 'badges',
};

function makeEntity(entityName) {
    const table = TABLE_MAP[entityName];

    return {
        async list(sort = '-created_date', limit = 200) {
            const descending = sort.startsWith('-');
            const column = sort.replace(/^-/, '');
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .order(column, { ascending: !descending })
                .limit(limit);
            if (error) throw error;
            return data;
        },

        async create(payload) {
            const { data, error } = await supabase
                .from(table)
                .insert(payload)
                .select()
                .single();
            if (error) throw error;
            return data;
        },

        async update(id, payload) {
            const { data, error } = await supabase
                .from(table)
                .update(payload)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },

        async delete(id) {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
    };
}

export const db = {
    entities: {
        SavedConfig: makeEntity('SavedConfig'),
        ResourceLink: makeEntity('ResourceLink'),
        Project: makeEntity('Project'),
        Badge: makeEntity('Badge'),
    },
};