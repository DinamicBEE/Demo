import {
  Button,
  Flex,
  FormatNumber,
  HStack,
  Table,
  Text,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@components/ui/pagination";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import { CouponCatalogModel, DialogCouponsProps } from "@models/prepaid.model";
import { useEffect, useState } from "react";
const pageSize = 10;
function DialogCoupons({
  isOpen,
  onClose,
  coupons,
  client
}: DialogCouponsProps) {
  const [visibleItems, setVisibleItems] = useState<CouponCatalogModel[]>([]);
  const [page, setPage] = useState(1);
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    if (coupons) {
      const paginatedItems = coupons.slice(startRange, endRange);
      setVisibleItems(paginatedItems);
    }
  }, [coupons, page]);

  return (
    <DialogRoot
      open={isOpen}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      scrollBehavior="inside"
      onOpenChange={() => {
        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cupones agregados a {client}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Table.ScrollArea borderWidth="1px" rounded="md">
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader textAlign="center">
                    Folio
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Precio unitario
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Fecha</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {visibleItems?.map((item) => (
                  <Table.Row
                    key={`${item.folio}-${item.validityDate}-${item.consumeCenter}`}
                  >
                    <Table.Cell textAlign="center">
                      <Text>{item.folio}</Text>
                    </Table.Cell>

                    <Table.Cell>
                      <Text>
                        <FormatNumber
                          value={item.amount}
                          style="currency"
                          currency="USD"
                        />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>{item.validityDateCustom}</Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          <PaginationRoot
            count={coupons.length}
            pageSize={pageSize}
            page={page}
            onPageChange={(e) => setPage(e.page)}
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </DialogBody>

        <DialogFooter>
          <Flex gap={4}>
            <Button
              colorPalette="meraError"
              onClick={() => {
                onClose();
              }}
            >
              Cerrar
            </Button>
          </Flex>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default DialogCoupons;
