import { useState, useMemo } from 'react';
import { Calculator, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';

export default function MortgageCalculator({ price = 500000 }) {
    const [homePrice, setHomePrice] = useState(price);
    const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState('30');

    const { monthlyPayment, totalInterest, totalPaid, loanAmount } = useMemo(() => {
        const principal = homePrice - downPayment;
        const r = interestRate / 100 / 12;
        const n = Number(loanTerm) * 12;
        const monthly = r > 0
            ? (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
            : principal / n;
        return {
            loanAmount: principal,
            monthlyPayment: monthly,
            totalInterest: monthly * n - principal,
            totalPaid: monthly * n,
        };
    }, [homePrice, downPayment, interestRate, loanTerm]);

    return (
        <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                    <Calculator className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold">Mortgage Calculator</h3>
                    <p className="text-xs text-muted-foreground">Estimate your monthly payment</p>
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <Label className="text-sm">Home Price</Label>
                    <Input type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))} />
                </div>
                <div>
                    <Label className="text-sm">Down Payment</Label>
                    <Input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
                    <p className="text-xs text-muted-foreground mt-1">{loanAmount > 0 ? `${((downPayment / homePrice) * 100).toFixed(0)}% down` : ''}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-sm">Interest Rate (%)</Label>
                        <Input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
                    </div>
                    <div>
                        <Label className="text-sm">Loan Term</Label>
                        <Select value={loanTerm} onValueChange={setLoanTerm}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 years</SelectItem>
                                <SelectItem value="20">20 years</SelectItem>
                                <SelectItem value="30">30 years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <DollarSign className="w-4 h-4 text-primary" /> Estimated Monthly Payment
                </div>
                <p className="text-3xl font-bold text-primary">{formatPrice(monthlyPayment)}</p>
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-primary/10">
                    <span>Loan Amount: {formatPrice(loanAmount)}</span>
                    <span>Total Interest: {formatPrice(totalInterest)}</span>
                </div>
            </div>
        </Card>
    );
}