-- Stored Procedures and Triggers for SAARTHI Civic Technology Platform

-- 1. Auto-update timestamp trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users
DROP TRIGGER IF EXISTS update_users_modtime ON users;
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 2. Procedure to calculate vehicle bluebook tax with late fine penalty
CREATE OR REPLACE FUNCTION calculate_bluebook_tax_with_fine(
    p_engine_cc INT,
    p_due_years INT DEFAULT 1
)
RETURNS TABLE (
    base_tax NUMERIC,
    penalty_amount NUMERIC,
    total_due NUMERIC
) AS $$
DECLARE
    v_base NUMERIC := 3000;
    v_fine NUMERIC := 0;
BEGIN
    IF p_engine_cc <= 125 THEN v_base := 3000;
    ELSIF p_engine_cc <= 150 THEN v_base := 5000;
    ELSIF p_engine_cc <= 225 THEN v_base := 6500;
    ELSIF p_engine_cc <= 400 THEN v_base := 11000;
    ELSE v_base := 20000;
    END IF;

    IF p_due_years > 1 THEN
        v_fine := v_base * 0.20 * (p_due_years - 1);
    END IF;

    RETURN QUERY SELECT v_base * p_due_years, v_fine, (v_base * p_due_years) + v_fine;
END;
$$ LANGUAGE plpgsql;
