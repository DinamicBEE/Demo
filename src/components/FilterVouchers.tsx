import { useEffect, useRef, useState } from "react";
import {
  Box,
  createListCollection,
  ListCollection,
  Portal,
  Select,
  Span,
  Stack,
} from "@chakra-ui/react";
import { VoucherFilter, voucherSelectOption } from "@models/tdc.model";

function FilterVoucher({
  vouchers,
  label,
  itemId,
  voucherSelect,
  onSelect,
  disabled,
}: VoucherFilter) {
  //

  const [searchQuery, setSearchQuery] = useState<string>("Selecciona ticket");
  const [filteredVouchers, setFilteredVouchers] = useState<ListCollection<voucherSelectOption>>(
    createListCollection<voucherSelectOption>({ items: [] })
  );
  const searchRef = useRef<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const sortedVouchers = [...vouchers].sort((a, b) => {
      const checkA = Number(a.check);
      const checkB = Number(b.check);
      
      if (!isNaN(checkA) && !isNaN(checkB)) {
        return checkA - checkB;
      }
      return a.check.localeCompare(b.check);
    });

    const voucherCollection = createListCollection<voucherSelectOption>({
      items: sortedVouchers.map((voucher) => ({
        label: `${voucher.check}`,
        value: `${voucher.idCustom} - ${voucher.amount}`,
        description: `${formatNumber(voucher.amount)} - Fecha: ${voucher.dateDisplay}`,
      })),
    });
    setFilteredVouchers(voucherCollection);
  }, [vouchers]);

  function handleSearch(event: string) {    
    if (event.toLowerCase() === "enter" && searchRef.current.length >= 1) {
      if (filteredVouchers.items.length > 0) {
        const firstVoucher = filteredVouchers.items[0];
        const selectEvent = {
          value: [firstVoucher.value],
        };
        handleSelect(selectEvent);
      }
      return;
    }
    
    let query: string = "";
    if (event.toLowerCase() === "backspace") {
      query = searchRef.current.slice(0, -1);
    } else if (event.length == 1) {
      query = searchRef.current + event.toLowerCase();
    } else {
      query = searchRef.current;
    }
    setSearchQuery(query);
    searchRef.current = query;

    const filtered = vouchers
      .filter((voucher) => voucher.check.toLowerCase().includes(query))
      .sort((a, b) => {
        const checkA = Number(a.check);
        const checkB = Number(b.check);
        
        if (!isNaN(checkA) && !isNaN(checkB)) {
          return checkA - checkB;
        }
        return a.check.localeCompare(b.check);
      });

    const voucherCollection = createListCollection<voucherSelectOption>({
      items: filtered.map((voucher) => ({
        label: `${voucher.check}`,
        value: `${voucher.idCustom} - ${voucher.amount}`,
        description: `${formatNumber(voucher.amount)} - Fecha: ${voucher.dateDisplay}`,
      })),
    });
    setFilteredVouchers(voucherCollection);
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  function handleSelect(event: any) {
    const selectedId = Number(event.value[0]);
    const selectedValue = event.value[0].split(" - ")[0];
    const selectedAmount = event.value[0].split(" - ")[1];

    const voucherSelect = vouchers.find(
      (voucher) =>
        voucher.idCustom === selectedValue &&
        voucher.amount === Number(selectedAmount)
    );

    if (voucherSelect && itemId === undefined) {
      onSelect(voucherSelect);
    } else if (voucherSelect && itemId != undefined) {
      onSelect(voucherSelect, itemId);
    }
    setSearchQuery("");
    searchRef.current = "";
    handleSearch("");
    setIsOpen(false);
  }

  return (
    <Box width="100%">
      {/* <SelectRoot
        collection={filteredCustomer}
        onKeyUp={(e) => handleSearch(e.key)}
        onValueChange={(event) => handleSelect(event)}
        disabled={disabled || false}
        value={[]}
      >
        {label && <SelectLabel>Cliente</SelectLabel>}
        <SelectTrigger>
          <SelectValueText placeholder={customerSelect || searchQuery} />
        </SelectTrigger>

        <SelectContent style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filteredCustomer.items.map((movie) => (
            <SelectItem item={movie} key={movie.value}>
              {movie.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot> */}
      <Select.Root
        collection={filteredVouchers}
        closeOnSelect={false}
        onKeyUp={(e) => handleSearch(e.key)}
        onValueChange={(event) => handleSelect(event)}
        disabled={disabled || false}
        size="sm"
        width={"100%"}
        value={[]}
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Select.HiddenSelect />
        <Select.Label>Selecciona ticket</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText
              placeholder={searchQuery || "Selecciona ticket"}
            />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {filteredVouchers.items.map((voucher) => (
                <Select.Item
                  item={voucher}
                  key={voucher.value + voucher.description}
                >
                  <Stack gap="0">
                    <Select.ItemText>{voucher.label}</Select.ItemText>
                    <Span color="fg.muted" textStyle="xs">
                      {voucher.description}
                    </Span>
                  </Stack>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Box>
  );
}

export default FilterVoucher;
