package uom;

public abstract class AbstractUnit<B> implements Unit<B> {
    
    @Override
    public Unit<B> multiply(Unit<B> other) {
        return new PowerProduct<B>(this, other);
    }
    
    @Override
    public <T> T fold(UnitFold<B, T> fold) {
        T result = null;
        for (B base : bases()) {
            Fraction power = power(base);
            T mapped;
            if (power.equals(Fraction.ONE)) {
                mapped = fold.map(base);
            } else {
                mapped = fold.expt(fold.map(base), power);
            }
            if (result == null) {
                result = mapped;
            } else {
                result = fold.mult(result, mapped);
            }
        }
        return (result == null) ? fold.one() : result;
        /*
        T result = fold.one();
        for (B base : bases()) {
            T mapped = fold.expt(fold.map(base), power(base));
            result = fold.mult(result, mapped);
        }
        return result;
        */
    }
    
    @Override
    public Unit<B> map(UnitMap<B> map) {
        Unit<B> newUnit = new PowerProduct<B>();
        for (B base : bases()) {
            Unit<B> mapped = map.map(base).raise(power(base));
            newUnit = newUnit.multiply(mapped);
        }
        return newUnit;
    }
}
