import { useState, useEffect } from 'react';
import { invoiceService } from '@/api/services';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/format';

export default function InvoicesTab() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        invoiceService.list({ ordering: '-created_date' })
            .then(data => setInvoices(data.results || data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="py-10 text-center text-muted-foreground">Loading...</div>;

    if (invoices.length === 0) {
        return (
            <Card className="p-10 text-center">
                <p className="text-muted-foreground">No invoices yet. Subscribe to a plan to see your billing history.</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map(inv => (
                        <TableRow key={inv.id}>
                            <TableCell className="font-mono text-sm">{inv.invoice_number || '—'}</TableCell>
                            <TableCell>{inv.plan_name}</TableCell>
                            <TableCell className="font-medium">${inv.amount}</TableCell>
                            <TableCell>
                                <Badge className={inv.status === 'paid' ? 'bg-green-500 text-white' : inv.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}>
                                    {inv.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{formatDate(inv.invoice_date)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}