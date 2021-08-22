import { Skeleton, VStack } from "@chakra-ui/react";

interface ItemsSkeletonProps {
  height: string;
  count?: number;
}

const ItemsSkeleton = ({
  height,
  count = 3,
}: ItemsSkeletonProps): JSX.Element => (
  <VStack width="100%">
    {new Array(count).fill(<Skeleton height={height} width="100%" />)}
  </VStack>
);

ItemsSkeleton.defaultProps = {
  count: 3,
};

export default ItemsSkeleton;
